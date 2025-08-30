use core::str;

use axum::{extract::State, Json};
use sea_orm::{ActiveModelTrait, EntityTrait};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::{entities::user, utils::auth_user::AuthenticatedUser, AppState};

#[derive(ToSchema, Serialize, Deserialize)]
pub struct CreateUserRequest {
    name: String,
    email: String,
}

#[utoipa::path(
    post,
    path = "/user/create",
    request_body = CreateUserRequest,
    responses(
        (status = 201, description = "User created", body = user::Model),
        (status = 409, description = "User already exists", body = String),
        (status = 500, description = "Internal server error", body = String),
    ),
    tag = "User",
    security(
        ("bearer_auth" = [])
    )
)]

pub async fn user_create(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Json(payload): Json<CreateUserRequest>,
) -> Result<Json<user::Model>, (axum::http::StatusCode, String)> {
    let user_id = user.0.sub;
    let user_name = payload.name;
    let user_email = payload.email;

    let check_user = user::Entity::find_by_id(user_id.clone())
        .one(&state.db)
        .await
        .map_err(|_| {
            (
                axum::http::StatusCode::INTERNAL_SERVER_ERROR,
                "Database error".into(),
            )
        })?;
    if check_user.is_some() {
        return Err((
            axum::http::StatusCode::CONFLICT,
            "User already exists".into(),
        ));
    }

    let new_user = user::ActiveModel {
        id: sea_orm::ActiveValue::Set(user_id),
        name: sea_orm::ActiveValue::Set(user_name),
        email: sea_orm::ActiveValue::Set(user_email),
    };

    let user = new_user.insert(&state.db).await.map_err(|_| {
        (
            axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            "Database error".into(),
        )
    })?;

    Ok(Json(user))
}
