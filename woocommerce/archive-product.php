<?php
/**
 * The Template for displaying product archives, including the main shop page which is a post type archive
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/archive-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates
 * @version 3.4.0
 */
?> 

<?php

defined( 'ABSPATH' ) || exit;


/**
 * Hook: woocommerce_before_main_content.
 *
 * @hooked woocommerce_output_content_wrapper - 10 (outputs opening divs for the content)
 * @hooked woocommerce_breadcrumb - 20
 * @hooked WC_Structured_Data::generate_website_data() - 30
 */
do_action( 'woocommerce_before_main_content' ); 
if (!is_product()):
get_header( 'shop' );
?>
<header class="woocommerce-products-header">
	<?php if ( apply_filters( 'woocommerce_show_page_title', true ) ) : ?>
		<h1 class="woocommerce-products-header__title page-title"><?php woocommerce_page_title(); ?></h1>
	<?php endif; ?>

	<?php
	/**
	 * Hook: woocommerce_archive_description.
	 *
	 * @hooked woocommerce_taxonomy_archive_description - 10
	 * @hooked woocommerce_product_archive_description - 10
	 */
	do_action( 'woocommerce_archive_description' );
	?>
</header>
<?php
if ( woocommerce_product_loop() ) {

	/**
	 * Hook: woocommerce_before_shop_loop.
	 *
	 * @hooked woocommerce_output_all_notices - 10
	 * @hooked woocommerce_result_count - 20
	 * @hooked woocommerce_catalog_ordering - 30
	 */
	do_action( 'woocommerce_before_shop_loop' );

	woocommerce_product_loop_start();

	if ( wc_get_loop_prop( 'total' ) ) {
		while ( have_posts() ) {
			the_post();

			/**
			 * Hook: woocommerce_shop_loop.
			 *
			 * @hooked WC_Structured_Data::generate_product_data() - 10
			 */
			do_action( 'woocommerce_shop_loop' );

			wc_get_template_part( 'content', 'product' );
		}
	}

	woocommerce_product_loop_end();

	/**
	 * Hook: woocommerce_after_shop_loop.
	 *
	 * @hooked woocommerce_pagination - 10
	 */
	do_action( 'woocommerce_after_shop_loop' );
} else {
	/**
	 * Hook: woocommerce_no_products_found.
	 *
	 * @hooked wc_no_products_found - 10
	 */
	do_action( 'woocommerce_no_products_found' );
}

/**
 * Hook: woocommerce_after_main_content.
 *
 * @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
 */
do_action( 'woocommerce_after_main_content' );

/**
 * Hook: woocommerce_sidebar.
 *
 * @hooked woocommerce_get_sidebar - 10
 */
get_footer('shop');
do_action( 'woocommerce_sidebar' );
else:
	// Product page
	$product = wc_get_product($post->ID);
	?>

	<div class="product-wrapper">
		<div class="row">
			<div class="col-md-9">
				<div class="row">
					<div class="col-md-4 flex flex--centered">
						<img src="<?php echo get_the_post_thumbnail_url($product->get_ID(), 'medium'); ?>" />
					</div>
					<div class="col-md-8 flex flex--centered">
						<h2>
							<?php the_title(); ?>
						</h2>
						<p class="product-excerpt">
							<?php echo strip_tags(get_the_excerpt(), "b,strong") ?>
						</p>
					</div>
				</div>
			</div>
			<div class="col-md-3 flex flex--centered">
				<div class="product-buttons-wrapper">
					<button class="button-medium button-block button--outlined take-part-<?php echo $product->get_id() ?>">
						<?php _e('Принять участие', 'brainworks'); ?>
					</button>
					<div class="sp-md-1 sp-sm-1 sp-xs-1"></div>
					<?php echo do_shortcode('[add_to_cart id="'.$product->get_id().'" show_price="FALSE" style="border: 0;" class="button-inside button-medium" quantity="1"]'); ?>
					<div class="sp-md-2 sp-sm-2 sp-xs-2"></div>
					<label class="custom-checkbox">
						<input type="checkbox"/>
						<span>
							<?php _e('Я согласен получать сообщение о новостях сайта', 'brainworks'); ?>
							
							<?php echo get_bloginfo('name'); ?>
						</span>
					</label>
				</div>
			</div>
		</div>

		<div class="sp-md-4 sp-sm-4 sp-xs-4"></div>

		<div class="row">
			<div class="col-md-8">
				<div class="product-card product-content">
					<?php echo apply_filters('the_content', $post->post_content) ?>
				</div>
			</div>
			<div class="col-md-4">
				<div class="product-card product-attrs">
					<table class="product-attrs-table">
						<tbody>
							<?php bw_get_product_attributes($product); ?>	
						</tbody>
					</table>
				</div>
				<div class="product-card product-related-block text-center">
					<h3 class="product-card-header">
						<?php _e('Курсы на эту тематику', 'brainworks'); ?>
					</h3>
					<div class="h-line"></div>
					<ul class="product-related-list">
						<?php bw_product_get_related($product); ?>
					</ul>
				</div>
				<div class="product-card product-related-block text-center">
					<h3 class="product-card-header">
						<?php _e('Поделиться', 'brainworks'); ?>
					</h3>
					<div class="h-line"></div>
					<?php dynamic_sidebar( 'sidebar-1' ); ?>
				</div>
			</div>
		</div>
	</div>

	<?php 
endif;
