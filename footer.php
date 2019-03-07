</div><!-- .page-wrapper end-->

<footer class="footer js-footer">
    <?php if (is_active_sidebar('footer-widget-area')) : ?>
        <div class="pre-footer">
            <div class="container">
                <div class="row">
                    <?php dynamic_sidebar('footer-widget-area'); ?>
                </div>
            </div>
        </div><!-- .pre-footer end-->
    <?php endif; ?>

    <div class="footer-main">
        <div class="logo footer-logo"><?php get_default_logo_link(true, '#000'); ?></div>
        <div class="container">
            <div class="footer-row row text-uppercase d-flex justify-content-center align-items-center">
                <div class="col-xs-12 col-md-4 footer-column footer-copyright">
                    &copy; <?php echo date('Y'); ?> &laquo;4life&raquo;. <?php _e('All right received', 'brainworks'); ?>
                </div>
                <div class="col-xs-12 col-md-4 footer-column text-center">
                    <?php if (has_social()) { ?>
                        <ul class="social">
                            <?php foreach (get_social() as $name => $social) { ?>
                                <li class="social-item">
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
                <div class="col-xs-12 col-md-4 footer-column text-right footer-developer">
                    <?php _e('Developed by', 'brainworks') ?>
                    <a href="https://brainworks.pro" target="_blank">BRAIN WORKS</a>
                </div>
            </div>
        </div>
    </div>
</footer>

</div><!-- .wrapper end-->

<?php scroll_top(); ?>

<?php if (is_customize_preview()) { ?>
    <button class="button-small customizer-edit" data-control='{ "name":"bw_scroll_top_display" }'>
        <?php esc_html_e('Edit Scroll Top', 'brainworks'); ?>
    </button>
    <button class="button-small customizer-edit" data-control='{ "name":"bw_analytics_google_placed" }'>
        <?php esc_html_e('Edit Analytics Tracking Code', 'brainworks'); ?>
    </button>
    <button class="button-small customizer-edit" data-control='{ "name":"bw_login_logo" }'>
        <?php esc_html_e('Edit Login Logo', 'brainworks'); ?>
    </button>
<?php } ?>

<div class="is-hide"><?php svg_sprite(); ?></div>

<?php wp_footer(); ?>

</body>
</html>
