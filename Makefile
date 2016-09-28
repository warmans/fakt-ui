PROJECT_OWNER=warmans
PROJECT_NAME=fakt-ui
PROJECT_VERSION=0.10.0
DOCKER_NAME=$(PROJECT_OWNER)/$(PROJECT_NAME)

# Go
#-----------------------------------------------------------------------

.PHONY: test
test:
	@go test

.PHONY: build
build:
	GO15VENDOREXPERIMENT=1 NOCGO=true go build -ldflags "-X main.VERSION=$(PROJECT_VERSION)" -o .build/$(PROJECT_NAME)

.PHONY: static
static:
	@sed -i "s/\?cb\=[0-9]*/?cb=$$(date +%s)/g" ui/static/index.html
	${GOPATH}/bin/esc -prefix="ui/static" -o static.go ui/static

# Packaging
#-----------------------------------------------------------------------

.PHONY: docker-build
docker-build:
	docker build -t $(DOCKER_NAME):$(PROJECT_VERSION) .

.PHONY: docker-publish
docker-publish:
	docker push $(DOCKER_NAME):$(PROJECT_VERSION)

# Meta
#-----------------------------------------------------------------------

.PHONY: publish
publish: static build docker-build docker-publish