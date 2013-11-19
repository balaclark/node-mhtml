
test:
	@./node_modules/mocha/bin/mocha --reporter spec test

setup:
	@npm install

cover:
	@./node_modules/istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha test -- --ui bdd -t 5000

clean:
	@rm -rf coverage

.PHONY: test setup cover clean
