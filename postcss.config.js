export default {
    plugins: {
		'postcss-nested': {},
		// 允许scss中，进行嵌套的类名写法
		'tailwindcss/nesting': 'postcss-nesting',
		tailwindcss: {},
		autoprefixer: {}
	}
  }