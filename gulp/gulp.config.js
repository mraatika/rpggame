var dest = './dist';
var src = './src';
var assets = src + '/assets';

module.exports = {

    assets: {
        src: [assets + '/**/*.*', '!' + assets + '/images/*'],
        dest: dest + '/assets/'
    },

    server: {
        settings: {
            root: dest,
            host: 'localhost',
            port: 3552,
            livereload: {
                port: 35929
            }
        }
    },

    images: {
        src: assets + '/images/*',
        dest: dest + '/assets/images/'
    },

    lint: {
        src: ['src/**/*.js', '!test/**/*', '!src/vendor/**/*']
    },

    watch: {
        src: [src + '/**/*.*'],
        watchers: [
            {
                src: [src + '/**/*.js'],
                tasks: ['lint', 'scripts']
            },
            {
                src: [
                    assets + '/**/*.json',
                    assets + '/config/*',
                    assets + '/css/*',
                    assets + '/fonts/*',
                    assets + '/json/*',
                    assets + '/sounds/*'
                ],
                tasks: ['assets']
            },
            {
                src: [assets + '/images/*'],
                tasks: ['images']
            }
        ]
    }
};
