/**
 * 各种翻译模式的示例格式配置
 */

export interface ExampleFormat {
  title: string;
  description: string;
  example: string;
  placeholder: string;
}

export const EXAMPLE_FORMATS = {
  text: {
    title: '文本翻译模式',
    description: '文本模式适合翻译普通的文字内容，支持多行文本和中英文混合翻译。',
    example: `This is a translation program that can translate various languages.
It supports text translation in multiple formats.
Hello World!
Welcome to our application.`,
    placeholder: `请输入待翻译的文本，例如：
This is a translation program that can translate various languages.
It supports text translation in multiple formats.
Hello World!
Welcome to our application.`
  },

  simpleJSON: {
    title: '简单JSON翻译模式',
    description: '简单JSON模式适合翻译扁平结构的JSON数据，常用于网站界面文本的国际化。',
    example: `{
  "welcome_message": "Welcome to our website",
  "login_button": "Login",
  "register_button": "Register",
  "home_title": "Home Page",
  "about_us": "About Us",
  "contact_info": "Contact Information",
  "search_placeholder": "Search...",
  "submit_button": "Submit",
  "cancel_button": "Cancel"
}`,
    placeholder: `请输入待翻译的简单JSON格式数据，例如：
{
  "welcome_message": "Welcome to our website",
  "login_button": "Login",
  "register_button": "Register",
  "home_title": "Home Page",
  "about_us": "About Us",
  "contact_info": "Contact Information"
}`
  },

  complexJSON: {
    title: '复杂JSON翻译模式',
    description: '复杂JSON模式适合翻译嵌套结构的JSON数据，支持多层级的数据组织，适用于复杂应用的国际化需求。',
    example: `{
  "talented": "You're good!",
  "symbolise": {
    "title": "Get Success",
    "content": "Get Success"
  },
  "mode": {
    "title": "Mode",
    "game_mode": {
      "title": "Game Mode",
      "single": "Single",
      "multi": "Multi"
    }
  },
  "navigation": {
    "header": {
      "home": "Home",
      "about": "About Us",
      "services": "Our Services",
      "contact": "Contact"
    },
    "footer": {
      "copyright": "All rights reserved",
      "privacy": "Privacy Policy",
      "terms": "Terms of Service"
    }
  },
  "content": {
    "welcome": "Welcome to our platform",
    "description": "We provide excellent services",
    "features": {
      "feature1": "Fast and reliable",
      "feature2": "Easy to use",
      "feature3": "24/7 support"
    }
  }
}`,
    placeholder: `请输入待翻译的复杂JSON格式数据，例如：
{
  "navigation": {
    "header": {
      "home": "Home",
      "about": "About Us",
      "services": "Our Services"
    },
    "footer": {
      "copyright": "All rights reserved",
      "contact": "Contact Us"
    }
  },
  "content": {
    "welcome": "Welcome to our platform",
    "description": "We provide excellent services"
  }
}`
  },

  php: {
    title: 'PHP数组翻译模式',
    description: 'PHP数组模式适合翻译PHP语言中的数组格式文件，支持复杂的嵌套结构和各种PHP数组语法。',
    example: `<?php
return [
    'page_common' => [
        'login_welcome_title' => 'Welcome to',
        'chosen_select_no_results_text' => 'No matching results',
        'error_text' => 'Abnormal error',
        'reminder_title' => 'Warm prompt',
        'operate_params_error' => 'Incorrect operation parameters',
        'not_operate_error' => 'No related operation',
        'not_data_error' => 'No relevant data',
        'input_empty_tips' => 'Please enter data',
        'not_fill_in_error' => 'Please fill in the data',
        'not_choice_error' => 'Please select data',
        'before_choice_data_tips' => 'Please select data first',
        'data_error' => 'Data error',
        'icon_name' => 'Icon',
        'title_name' => 'Name',
        'status_name' => 'Status',
        'confirm_name' => 'Confirm',
        'cancel_name' => 'Cancel'
    ],
    'error' => 'Exception Error',
    'operate_fail' => 'Operation Failed',
    'operate_success' => 'Operation Succeeded',
    'report_fail' => 'Report Failed',
    'report_success' => 'Report Succeeded',
    'get_fail' => 'Get Failed'
];
?>`,
    placeholder: `请输入PHP数组格式数据，例如：
<?php
return [
    'key1' => 'value1',
    'key2' => 'value2',
    'nested' => [
        'subkey' => 'subvalue'
    ]
];
?>`
  }
} as const;

export type ExampleFormatType = keyof typeof EXAMPLE_FORMATS;
