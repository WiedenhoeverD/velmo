#! /bin/bash

sea-orm-cli generate entity -u postgres://postgres:postgres@localhost/postgres -o src/entities --with-serde both
find src/entities -name "*.rs" -exec sed -i '' 's/pub struct Model/#\[derive(utoipa::ToSchema)\]\npub struct Model/' {} +
find ./src/entities -name "*.rs" -exec sed -i '' 's/pub \(.*\): Uuid,/#[schema(value_type = String)]\n    pub \1: Uuid,/' {} +
find src/entities -name "*.rs" -exec sed -i '' 's/pub enum/#\[derive(utoipa::ToSchema)\]\npub enum/' {} +
rustfmt-unstable --apply