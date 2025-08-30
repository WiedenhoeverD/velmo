use core::str;

use axum::{extract::State, Json};
use sea_orm::ActiveModelTrait;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::{
    entities::{accounts, sea_orm_active_enums::Accounttype},
    utils::auth_user::AuthenticatedUser,
    AppState,
};

#[derive(ToSchema, Serialize, Deserialize)]
pub struct CreateAccountRequest {
    name: String,
    account_type: Accounttype,
    balance: i32,
    iban: String,
}

#[utoipa::path(
    post,
    path = "/accounts/create",
    request_body = CreateAccountRequest,
    responses(
        (status = 201, description = "Account created", body = accounts::Model),
        (status = 500, description = "Internal server error", body = String),
    ),
    tag = "Account",
    security(
        ("bearer_auth" = [])
    )
)]

pub async fn account_create(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Json(payload): Json<CreateAccountRequest>,
) -> Result<Json<accounts::Model>, (axum::http::StatusCode, String)> {
    let user_id = user.0.sub;

    let new_account = accounts::ActiveModel {
        user_id: sea_orm::ActiveValue::Set(user_id),
        account_type: sea_orm::ActiveValue::Set(payload.account_type),
        balance: sea_orm::ActiveValue::Set(payload.balance),
        iban: sea_orm::ActiveValue::Set(payload.iban),
        name: sea_orm::ActiveValue::Set(payload.name),
        ..Default::default()
    };

    let account = new_account.insert(&state.db).await.map_err(|err| {
        (
            axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            format!("Database error: {}", err),
        )
    })?;

    println!("Created account: {:?}", account);

    Ok(Json(account))
}
