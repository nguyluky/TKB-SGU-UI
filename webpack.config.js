const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js', // Dẫn tới file index.js ta đã tạo
    output: {
        path: path.join(__dirname, '/build'), // Thư mục chứa file được build ra
        filename: 'bundle.js', // Tên file được build ra
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Sẽ sử dụng babel-loader cho những file .js
                exclude: /node_modules/, // Loại trừ thư mục node_modules
                use: ['babel-loader'],
            },
            {
                test: /\.css$/, // Sử dụng style-loader, css-loader cho file .css
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpe?g|png|gif|svg|ico)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                },
            },
        ],
    },
    devServer: {
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.ico',
        }),
    ],
};
