use axum::{extract::State, Json};
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

use crate::{entities::accounts, utils::auth_user::AuthenticatedUser, AppState};

#[utoipa::path(
    get,
    path = "/accounts",
    responses(
        (status = 200, description = "Alles Accounts from User", body = Vec<accounts::Model>),
        (status = 500, description = "Internal server error", body = String),
    ),
    tag = "Account",
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn accounts_all(
    State(state): State<AppState>,
    user: AuthenticatedUser,
) -> Result<Json<Vec<accounts::Model>>, (axum::http::StatusCode, String)> {
    let user_id = user.0.sub;
    let accounts = accounts::Entity::find()
        .filter(accounts::Column::UserId.eq(user_id))
        .all(&state.db)
        .await
        .map_err(|err| {
            (
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                err.to_string(),
            )
        })?;
    Ok(Json(accounts))
}
