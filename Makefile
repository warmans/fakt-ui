PREFIX=/usr
BINDIR=${DESTDIR}${PREFIX}/bin
PROJ=stressfaktor-api-ui
PACKAGE_TYPE=deb
PACKAGE_BUILD_DIR=temp
PACKAGE_DIR=dist

.PHONY: static
static:
	@sed -i "s/\?cb\=[0-9]*/?cb=$$(date +%s)/g" ui/static/index.html
	${GOPATH}/bin/esc -prefix="ui/static" -o static.go ui/static

.PHONY: build
build: static
	go build

.PHONY: install
install: build

	#install binary
	GOBIN=${BINDIR} go install -v

	#install init script
	install -Dm 755 init/${PROJ}.service ${DESTDIR}/etc/systemd/system/${PROJ}.service

.PHONY: package
package:

	#
	# export PACKAGE_TYPE to vary package type (e.g. deb, tar, rpm)
	#
	@if [ -z "$(shell which fpm 2>/dev/null)" ]; then \
		echo "error:\nPackaging requires effing package manager (fpm) to run.\nsee https://github.com/jordansissel/fpm\n"; \
		exit 1; \
	fi

	#run make install against the packaging dir
	mkdir -p ${PACKAGE_BUILD_DIR} && $(MAKE) install DESTDIR=${PACKAGE_BUILD_DIR}

	#clean
	mkdir -p ${PACKAGE_DIR} && rm -f dist/*.${PACKAGE_TYPE}

	#build package
	fpm --rpm-os linux \
		-s dir \
		-p dist \
		-t ${PACKAGE_TYPE} \
		-n ${PROJ} \
		-v `${PACKAGE_BUILD_DIR}${PREFIX}/bin/${PROJ} -v` \
		-C ${PACKAGE_BUILD_DIR} .