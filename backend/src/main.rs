use std::{
    env,
    io::Error,
    net::{Ipv4Addr, SocketAddr},
    sync::Arc,
};

use axum::{
    routing::{get, post},
    Router,
};
use chrono::{DateTime, Utc};
use dotenvy::dotenv;
use sea_orm::{Database, DatabaseConnection};
use serde::{Deserialize, Serialize};
use tokio::{net::TcpListener, sync::RwLock};
use utoipa::{OpenApi, ToSchema};
use utoipa_swagger_ui::SwaggerUi;

use crate::utils::jwks::{fetch_jwks, Jwks, SharedJwks};

mod entities;
mod rest;
mod utils;

#[derive(Serialize, Deserialize, ToSchema)]
struct Buchung {
    iban: String,
    #[serde(with = "chrono::serde::ts_seconds")]
    booking_date: DateTime<Utc>,
    payment_involved_name: String,
    purpose: String,
    amount: f64,
    category: String,
    balance: f64,
}

#[derive(Clone)]
pub struct AppState {
    pub db: DatabaseConnection,
    pub jwks: Arc<RwLock<Jwks>>,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv().ok();
    let jwks_url = "https://authentik.hobbylos.org/application/o/velmo/jwks/";
    let jwks = fetch_jwks(jwks_url).await.unwrap();
    let shared_jwks: SharedJwks = Arc::new(RwLock::new(jwks));

    #[derive(OpenApi)]
    #[openapi(
    info(title = "Velmo", version = "1.0", description = "Backend API for Velmo", license(
            name = "GNU General Public License v3.0",
            url = "https://www.gnu.org/licenses/gpl-3.0.html"
        )),
    paths(
        rest::user::create::user_create,
        rest::user::exists::user_exists,
    ),
    components(),
    security(
        ("bearer_auth" = [])
    )
)]
    struct ApiDoc;

    let db = Database::connect(env::var("POSTGRES_URL").unwrap())
        .await
        .unwrap();

    let state = AppState {
        db: db.clone(),
        jwks: shared_jwks.clone(),
    };
    let app = Router::new()
        .route("/user/exists", get(rest::user::exists::user_exists))
        .route("/user/create", post(rest::user::create::user_create))
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .with_state(state);

    let listener = TcpListener::bind(SocketAddr::new(Ipv4Addr::LOCALHOST.into(), 8080))
        .await
        .unwrap();
    println!("Listening on http://{}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
    Ok(())
}
