
test:
	@./node_modules/mocha/bin/mocha --reporter spec test

setup:
	@npm install

cover:
	@./node_modules/istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha test -- --reporter spec

coveralls: cover
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

clean:
	@rm -rf coverage

.PHONY: test setup cover coveralls clean
