.PHONY: build dev update init
build:
	hugo

dev:
	hugo serve --buildDrafts

update:
	hugo mod get -u ./...

init:
	git submodule update --init --recursive
