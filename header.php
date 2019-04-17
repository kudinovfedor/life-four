<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="<?php bloginfo('name'); ?> - <?php bloginfo('description'); ?>">
    <link rel="shortcut icon" href="<?php echo esc_url(get_template_directory_uri() . '/assets/img/favicon.ico'); ?>"
          type="image/x-icon">
    <link rel="icon" href="<?php echo esc_url(get_template_directory_uri() . '/assets/img/favicon.ico'); ?>"
          type="image/x-icon">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?> id="top">

<?php wp_body(); ?>

<div class="wrapper">

    <header class="header">
        <div class="container">
            <div class="row header-row d-flex flex-wrap align-items-center">
                <div class="col-xs-12 text-center header-logo">
                    <div class="logo"><?php get_default_logo_link(true, '#000'); ?></div>
                </div>
                <div class="col-xs-12 col-md-6 header-menu">
                    <?php if (has_nav_menu('main-nav')) { ?>
                        <nav class="nav js-menu">
                            <button type="button" tabindex="0"
                                    class="menu-item-close menu-close js-menu-close"></button>
                            <?php wp_nav_menu(array(
                                'theme_location' => 'main-nav',
                                'container' => false,
                                'menu_class' => 'menu-container',
                                'menu_id' => '',
                                'fallback_cb' => 'wp_page_menu',
                                'items_wrap' => '<ul id="%1$s" class="%2$s">%3$s</ul>',
                                'depth' => 3
                            )); ?>
                        </nav>
                    <?php } ?>
                </div>
                <div class="col-xs-12 col-md-6 text-right header-meta">
                    <div class="header-cell">
                        <a class=" header-basket basket" href="<?php echo esc_url(home_url('/my-account')); ?>">
                            <svg class="svg-icon is-hide" width="25" height="25" fill="#000">
                                <use href="#basket"></use>
                            </svg>
                            <i class="fal fa-user-circle" aria-hidden="true"></i>
                            <span class="basket-count">0</span>
                        </a> 
                    </div>
                    <div class="header-cell">
                        <a class=" header-basket basket" href="<?php echo esc_url(home_url('/cart')); ?>">
                            <svg class="svg-icon is-hide" width="25" height="25" fill="#000">
                                <use href="#basket"></use>
                            </svg>
                            <i class="fal fa-shopping-cart" aria-hidden="true"></i>
                            <span class="basket-count">0</span>
                        </a> 
                    </div>
                    <div class="header-cell header-search">
                        <button class="header-search-btn js-search-btn" type="button">
                            <svg class="svg-icon is-hide" width="25" height="25" fill="#000">
                                <use href="#search"></use>
                            </svg>
                            <i class="fal fa-search" aria-hidden="true"></i>
                        </button>
                    </div>
                    <?php if (has_social()) { ?>
                        <ul class="header-cell social">
                            <?php foreach (get_social() as $name => $social) { ?>
                                <li class="social-item social-sm">
                                    <a href="<?php echo esc_attr(esc_url($social['url'])); ?>"
                                       class="social-link social-<?php echo esc_attr($name); ?>" target="_blank">
                                        <?php if (!empty($social['icon-html'])) {
                                            echo strip_tags($social['icon-html'], '<i>');
                                        } else { ?>
                                            <i class="<?php echo esc_attr($social['icon']); ?>" aria-hidden="true"
                                               aria-label="<?php echo esc_attr($social['text']); ?>"></i>
                                        <?php } ?>
                                    </a>
                                </li>
                            <?php } ?>
                        </ul>
                    <?php } ?>
                </div>
            </div>
        </div>
        <div class="header-base"></div>
        <div class="header-search-form js-search-form is-hide">
            <div class="container">
                <div class="d-flex align-items-center">
                    <button class="header-search-close js-search-close" type="button">
                        <i class="fal fa-times" aria-hidden="true"></i>
                    </button>
                    <?php get_search_form(); ?>
                </div>
            </div>
        </div>
    </header>

    <!--<div class="text-center">
        <div class="button-medium">Continue reading</div>
        <div class="button-medium button-inverse">Continue reading</div>
        <div class="button-medium button-outline">Continue reading</div>
    </div>-->

    <div class="container js-container">

        <div class="nav-mobile-header">
            <button class="hamburger js-hamburger" type="button" tabindex="0">
                <span class="hamburger-box">
                    <span class="hamburger-inner"></span>
                </span>
            </button>
            <div class="logo"><?php get_default_logo_link(true, '#fff'); ?></div>
        </div>
