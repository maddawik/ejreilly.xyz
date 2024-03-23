build:
	hugo

dev:
	hugo serve --buildDrafts

update:
	hugo mod get -u ./...
