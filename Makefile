.PHONY: publish-npm

publish-npm:
	# Create backups
	cp package.json package.json.backup
	cp .npmrc .npmrc.backup

	# Update package.json name
	sed -i 's/"@thanhphuchuynh\/t-youtube-transcript-fetcher"/"t-youtube-transcript-fetcher"/g' package.json

	# Comment out all lines in .npmrc
	sed -i 's/^[^#]/#&/' .npmrc

	# Run npm publish
	npm publish || (mv package.json.backup package.json && mv .npmrc.backup .npmrc && exit 1)

	# Restore original files
	mv package.json.backup package.json
	mv .npmrc.backup .npmrc
