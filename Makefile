include $(shell echo .env)
export

.PHONY: run
run:
	@npm run dev

.PHONY: email
email:
	@npm run email

.PHONY: sql
sql:
	@awk 'FNR==1{print ""}1' ./database/queries/* > ./database/queries.sql
	@sqlc generate
	@rm ./database/queries.sql

.PHONY: db-dev
db-dev: db-up mig-dev

.PHONY: db-up
db-up:
	@docker compose -f ./database/compose.yaml up -d

.PHONY: db-down
db-down:
	@docker compose -f ./database.compose.yaml down --volumes

.PHONY: db-connect
connect-dev:
	@mysql -h 127.0.0.1 -P 3306 -u admin -padmin

.PHONY: mig
mig:
	@goose -dir=./database/migrations mysql "$$PROD_MYSQL_USER:$$PROD_MYSQL_PASS@tcp($$PROD_MYSQL_HOST:3306)/$$PROD_MYSQL_DATABASE" up

.PHONY: mig-down
mig-down:
	@goose -dir=./database/migrations mysql "$$PROD_MYSQL_USER:$$PROD_MYSQL_PASS@tcp($$PROD_MYSQL_HOST:3306)/$$PROD_MYSQL_DATABASE" down

.PHONY: mig-redo
mig-redo:
	@goose -dir=./database/migrations mysql "$$PROD_MYSQL_USER:$$PROD_MYSQL_PASS@tcp($$PROD_MYSQL_HOST:3306)/$$PROD_MYSQL_DATABASE" redo

.PHONY: mig-dev
mig-dev:
	@goose -dir=./database/migrations mysql "admin:admin@tcp(localhost:3306)/email" up

.PHONY: mig-dev-down
mig-dev-down:
	@goose -dir=./database/migrations mysql "admin:admin@tcp(localhost:3306)/email" down

.PHONY: mig-dev-redo
mig-dev-redo:
	@goose -dir=./database/migrations mysql "admin:admin@tcp(localhost:3306)/email" redo

.PHONY: otel-server
otel-server:
	@otel-desktop-viewer