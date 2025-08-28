use std::sync::Arc;

use serde::Deserialize;
use tokio::sync::RwLock;

#[derive(Debug, Deserialize, Clone)]
pub struct Jwk {
    pub kid: String,
    pub kty: String,
    pub alg: String,
    pub n: String,
    pub e: String,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Jwks {
    pub keys: Vec<Jwk>,
}

pub type SharedJwks = Arc<RwLock<Jwks>>;

pub async fn fetch_jwks(jwks_url: &str) -> Result<Jwks, reqwest::Error> {
    let resp = reqwest::get(jwks_url).await?;
    let jwks: Jwks = resp.json().await?;
    Ok(jwks)
}
