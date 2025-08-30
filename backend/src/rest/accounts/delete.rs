use core::str;

use axum::extract::{Path, State};
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, IntoActiveModel, QueryFilter};
use uuid::Uuid;

use crate::{entities::accounts, utils::auth_user::AuthenticatedUser, AppState};

#[utoipa::path(
    delete,
    path = "/accounts/delete/{account_id}",
    responses(
        (status = 200, description = "Account deleted"),
        (status = 404, description = "Account not found"),
        (status = 500, description = "Internal server error", body = String),
    ),
    params(
        ("account_id" = String, Path)
    ),
    tag = "Account",
    security(
        ("bearer_auth" = [])
    )
)]

pub async fn account_delete(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Path(account_id): Path<Uuid>,
) -> Result<(), (axum::http::StatusCode, String)> {
    let user_id = user.0.sub;

    let account = accounts::Entity::find_by_id(account_id)
        .filter(accounts::Column::UserId.eq(user_id))
        .one(&state.db)
        .await
        .map_err(|err| {
            (
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                format!("Database error: {}", err),
            )
        })?
        .ok_or((
            axum::http::StatusCode::NOT_FOUND,
            "Account not found".to_string(),
        ))?
        .into_active_model();

    let account = account.delete(&state.db).await.map_err(|err| {
        (
            axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            format!("Database error: {}", err),
        )
    });

    match account {
        Ok(_) => Ok(()),
        Err((status, message)) => Err((status, message)),
    }
}
