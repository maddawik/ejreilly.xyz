.PHONY: build
build:
	hugo

.PHONY: dev
dev:
	hugo serve --buildDrafts

.PHONY: update
update:
	hugo mod get -u ./...
