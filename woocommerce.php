<?php get_header(); ?>

<?php if (is_shop() || is_product_category()): ?>
<div class="row">
    <div class="col-md-8">
        <h2>
            <?php _e('Список курсов', 'brainworks'); ?>
        </h2>
    </div>
    <div class="col-md-4">
        <select class="bw-products-sort">
            <option value="none">
                - Не сортировать -
            </option>                           
            <option value="price_asc">
                Цена по возрастанию
            </option>
            <option value="price_desc">
                Цена по убыванию
            </option>
        </select>
    </div>
</div>
<?php endif; ?>
<div class="row">
    <?php if (is_shop() || is_product_category()) : ?>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <div class="sp-xs-4"></div>
            <div class="bw-product-filters" data-endpoints="/wp-json/brainworks/filters|/wp-json/brainworks/products">

            </div> 
            <?php get_sidebar(); ?>
        </div>
    <?php endif; ?>
    <div class="col-xs-12 <?php echo !is_single() ? 'col-sm-12 col-md-9 col-lg-9 col-xl-9' : ''; ?>">
        <?php if (is_product()): ?>
            <?php include_once(__DIR__ . '/woocommerce/archive-product.php'); ?>
        <?php else:  ?>
            <div class="sp-xs-4"></div>
            <div>
                <ul class="bw-product-list">
                    
                </ul>
                <ul class="bw-product-pagination"></ul>
            </div>
        <?php endif; ?>
    </div>
</div><!-- /.row -->

<?php get_footer(); ?>
