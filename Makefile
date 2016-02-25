.PHONY: static
static:
	sed -i "s/\?cb\=[0-9]*/?cb=$$(date +%s)/g" ui/static/index.html
	${GOPATH}/bin/esc -prefix="ui/static" -o static.go ui/static

.PHONY: build
build: static
	go build
