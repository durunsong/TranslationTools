import i18n from '@/i18n';

export interface ExampleFormat {
  title: string;
  description: string;
  example: string;
  placeholder: string;
}

export const getExampleFormats = () => ({
  text: {
    title: i18n.t('examples.text.title', '文本翻译模式'),
    description: i18n.t('examples.text.description', '文本模式适合翻译普通的文字内容，支持多行文本和中英文混合翻译。'),
    example: `This is a translation program that can translate various languages.
It supports text translation in multiple formats to {toLang}.
Hello World!
Welcome to our application.`,
    placeholder: i18n.t('examples.text.placeholder', `请输入待翻译的文本，例如：
This is a translation program that can translate various languages.
It supports text translation in multiple formats to {toLang}.
Hello World!
Welcome to our application.`)
  },

  simpleJSON: {
    title: i18n.t('examples.simpleJSON.title', '简单JSON翻译模式'),
    description: i18n.t('examples.simpleJSON.description', '简单JSON模式适合翻译扁平结构的JSON数据，常用于网站界面文本的国际化。'),
    example: `{
  "welcome_message": "Welcome to our website",
  "login_button": "Login",
  "register_button": "Register",
  "home_title": "Home Page",
  "about_us": "About Us",
  "contact_info": "Contact Information to {toLang}",
  "search_placeholder": "Search...",
  "submit_button": "Submit",
  "cancel_button": "Cancel"
}`,
    placeholder: i18n.t('examples.simpleJSON.placeholder', `请输入待翻译的简单JSON格式数据，例如：
{
  "welcome_message": "Welcome to our website",
  "login_button": "Login",
  "register_button": "Register",
  "home_title": "Home Page",
  "about_us": "About Us",
  "contact_info": "Contact Information to {toLang}"
}`)
  },

  complexJSON: {
    title: i18n.t('examples.complexJSON.title', '复杂JSON翻译模式'),
    description: i18n.t('examples.complexJSON.description', '复杂JSON模式适合翻译嵌套结构的JSON数据，支持多层级的对象和数组结构，适用于复杂的配置文件和数据结构。'),
    example: `{
  "app": {
    "name": "Translation Tool",
    "version": "1.0.0",
    "description": "A powerful translation application to {toLang}"
  },
  "ui": {
    "navigation": {
      "home": "Home",
      "about": "About",
      "contact": "Contact to {toLang}"
    },
    "buttons": {
      "submit": "Submit",
      "cancel": "Cancel",
      "save": "Save"
    },
    "messages": {
      "success": "Operation completed successfully",
      "error": "An error occurred",
      "warning": "Please check your input"
    }
  },
  "features": {
    "text": "Text translation",
    "file": "File translation",
    "batch": "Batch processing"
  }
}`,
    placeholder: i18n.t('examples.complexJSON.placeholder', `请输入复杂JSON格式数据，例如：
{
  "app": {
    "name": "Translation Tool",
    "description": "A powerful application to {toLang}"
  },
  "ui": {
    "buttons": {
      "submit": "Submit",
      "cancel": "Cancel"
    }
  }
}`)
  },

  php: {
    title: i18n.t('examples.php.title', 'PHP数组翻译模式'),
    description: i18n.t('examples.php.description', 'PHP数组模式适合翻译PHP语言中的数组格式文件，支持复杂的嵌套结构和各种PHP数组语法。'),
    example: `<?php
return [
    'page_common' => [
        'login_welcome_title' => 'Welcome to',
        'chosen_select_no_results_text' => 'No matching results to {toLang}',
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
    placeholder: i18n.t('examples.php.placeholder', `请输入PHP数组格式数据，例如：
<?php
return [
    'key1' => 'value1',
    'key2' => 'value2',
    'nested' => [
        'subkey' => 'subvalue'
    ]
];
?>`)
  }
} as const);

// 为了向后兼容，保留静态的 EXAMPLE_FORMATS
export const EXAMPLE_FORMATS = getExampleFormats();

export type ExampleFormatType = keyof ReturnType<typeof getExampleFormats>;