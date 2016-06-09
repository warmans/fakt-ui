PROJECT_NAME=stressfaktor-api-ui
PROJECT_VERSION=0.10.0

# Go
#-----------------------------------------------------------------------

.PHONY: test
test:
	@go test

.PHONY: build
build:
	go get
	GO15VENDOREXPERIMENT=1 go build -ldflags "-X main.VERSION=$(PROJECT_VERSION)"

.PHONY: static
static:
	@sed -i "s/\?cb\=[0-9]*/?cb=$$(date +%s)/g" ui/static/index.html
	${GOPATH}/bin/esc -prefix="ui/static" -o static.go ui/static

# Github Releases
#-----------------------------------------------------------------------

#this contains a github api token and is not included in the repo
include .make/private.mk

GH_REPO_OWNER = warmans
GH_REPO_NAME = stressfaktor-api-ui

RELEASE_TARGET_COMMITISH = master
RELEASE_ARTIFACT_DIR = .dist
RELEASE_ARTIFACT_REGEX = .*\.deb
RELEASE_VERSION=$(PROJECT_VERSION)

include .make/github.mk

# Packaging
#-----------------------------------------------------------------------

PACKAGE_NAME = $(PROJECT_NAME)
PACKAGE_CONTENT_DIR = .packaging
PACKAGE_TYPE := deb
PACKAGE_OUTPUT_DIR = $(RELEASE_ARTIFACT_DIR)/.
PACKAGE_VERSION = $(PROJECT_VERSION)

include .make/packaging.mk

.PHONY: _configure_package
_configure_package: build

	#install binary
	@mkdir -p $(PACKAGE_CONTENT_DIR)/usr/bin/ && cp $(PROJECT_NAME) $(PACKAGE_CONTENT_DIR)/usr/bin/.

	#install init script
	@install -Dm 755 init/$(PROJECT_NAME).service $(PACKAGE_CONTENT_DIR)/etc/systemd/system/$(PROJECT_NAME).service


# Meta
#-----------------------------------------------------------------------

.PHONY: publish
publish: build package release