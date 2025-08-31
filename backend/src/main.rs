use std::{
    env,
    io::Error,
    net::{Ipv4Addr, SocketAddr},
    sync::Arc,
};

use axum::{
    http,
    routing::{delete, get, post},
    Router,
};
use chrono::{DateTime, Utc};
use dotenvy::dotenv;
use sea_orm::{Database, DatabaseConnection};
use serde::{Deserialize, Serialize};
use tokio::{net::TcpListener, sync::RwLock};
use tower_http::cors::CorsLayer;
use utoipa::{OpenApi, ToSchema};
use utoipa_swagger_ui::SwaggerUi;

use crate::utils::jwks::{fetch_jwks, SharedJwks};

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
    pub jwks: SharedJwks,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv().ok();
    let jwks_url = env::var("AUTHENTIK_JWKS_URL").unwrap();
    let jwks = fetch_jwks(jwks_url.as_str()).await.unwrap();
    let shared_jwks: SharedJwks = Arc::new(RwLock::new(jwks));

    let cors = CorsLayer::new()
        .allow_origin(
            "http://localhost:3000"
                .parse::<http::HeaderValue>()
                .unwrap(),
        )
        .allow_methods([
            http::Method::GET,
            http::Method::POST,
            http::Method::PUT,
            http::Method::DELETE,
            http::Method::OPTIONS,
        ])
        .allow_headers([http::header::CONTENT_TYPE, http::header::AUTHORIZATION]);

    #[derive(OpenApi)]
    #[openapi(
    info(title = "Velmo", version = "1.0", description = "Backend API for Velmo", license(
            name = "GNU General Public License v3.0",
            url = "https://www.gnu.org/licenses/gpl-3.0.html"
        )),
    paths(
        rest::user::create::user_create,
        rest::user::exists::user_exists,
        rest::accounts::all::accounts_all,
        rest::accounts::create::account_create,
        rest::accounts::delete::account_delete
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
        .route("/accounts", get(rest::accounts::all::accounts_all))
        .route(
            "/accounts/create",
            post(rest::accounts::create::account_create),
        )
        .route(
            "/accounts/delete/{account_id}",
            delete(rest::accounts::delete::account_delete),
        )
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .with_state(state)
        .layer(cors);

    let listener = TcpListener::bind(SocketAddr::new(Ipv4Addr::LOCALHOST.into(), 8080))
        .await
        .unwrap();
    println!("Listening on http://{}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
    Ok(())
}
