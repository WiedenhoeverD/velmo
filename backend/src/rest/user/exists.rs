use axum::{extract::State, Json};
use sea_orm::EntityTrait;

use crate::{entities::user, utils::auth_user::AuthenticatedUser, AppState};

#[utoipa::path(
    get,
    path = "/user/exists",
    responses(
        (status = 200, description = "User exists", body = user::Model),
        (status = 404, description = "User not found", body = String),
        (status = 500, description = "Internal server error", body = String),
    ),
    tag = "User",
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn user_exists(
    State(state): State<AppState>,
    user: AuthenticatedUser,
) -> Result<Json<user::Model>, (axum::http::StatusCode, String)> {
    let user_id = user.0.sub;
    let user = user::Entity::find_by_id(user_id)
        .one(&state.db)
        .await
        .map_err(|err| {
            (
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                err.to_string(),
            )
        })?;
    match user {
        None => Ok(Err((
            axum::http::StatusCode::NOT_FOUND,
            "User not found".into(),
        ))?),
        Some(ref user) => Ok(Json(user.clone())),
    }
}
