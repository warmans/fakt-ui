
.PHONY: static
static:
	${GOPATH}/bin/esc -prefix="ui/static" -o static.go ui/static
