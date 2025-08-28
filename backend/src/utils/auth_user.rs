use std::env;

use axum::{
    extract::FromRequestParts,
    http::{request::Parts, StatusCode},
};
use jsonwebtoken::{decode, decode_header, Algorithm, DecodingKey, Validation};
use serde::{Deserialize, Serialize};

use crate::{utils::jwks::Jwks, AppState};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
    pub iss: String,
    pub aud: String,
}

pub struct AuthenticatedUser(pub Claims);

impl FromRequestParts<AppState> for AuthenticatedUser {
    type Rejection = (StatusCode, String);

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get("Authorization")
            .and_then(|h| h.to_str().ok())
            .ok_or((StatusCode::UNAUTHORIZED, "Missing auth header".to_string()))?;

        if !auth_header.starts_with("Bearer ") {
            return Err((StatusCode::UNAUTHORIZED, "Invalid auth header".to_string()));
        }

        let token = auth_header.trim_start_matches("Bearer ").to_string();

        // JWKS aus State lesen
        let jwks_guard = state.jwks.read().await;

        let claims = AuthenticatedUser::decode_with_jwks(&token, &jwks_guard)
            .map_err(|e| (StatusCode::UNAUTHORIZED, e))?;

        Ok(AuthenticatedUser(claims))
    }
}

impl AuthenticatedUser {
    fn decode_with_jwks(token: &str, jwks: &Jwks) -> Result<Claims, String> {
        let header = decode_header(token).map_err(|_| "Invalid header".to_string())?;
        let kid = header.kid.ok_or("No kid in token".to_string())?;

        let jwk = jwks
            .keys
            .iter()
            .find(|j| j.kid == kid)
            .ok_or("No matching JWK found".to_string())?;

        if jwk.kty != "RSA" {
            return Err("Unsupported key type".to_string());
        }

        // Convert base64url modulus (n) and exponent (e) to a key
        let decoding_key = DecodingKey::from_rsa_components(&jwk.n, &jwk.e)
            .map_err(|_| "Invalid RSA components".to_string())?;

        let mut validation = Validation::new(Algorithm::RS256);
        let aud = env::var("AUTHENTIK_CLIENT_ID").unwrap_or_else(|_| "".to_string());
        validation.set_audience(&[aud]);

        let token_data = decode::<Claims>(token, &decoding_key, &validation)
            .map_err(|e| format!("Failed to decode token: {}", e))?;

        Ok(token_data.claims)
    }
}
