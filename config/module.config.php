<?php
return array(
    'asset_manager' => array(
        'resolver_configs' => array(
            'paths' => array(
                __DIR__ . '/../dist/',
            ),
        ),
    ),
    'view_manager' => array(
        'template_map' => array(
            'zfegg-admin-ui' => __DIR__ . '/../view/zfegg-admin-ui.phtml',
            'zfegg-admin-ui-login' => __DIR__ . '/../view/zfegg-admin-ui-login.phtml',
        ),
    ),
);
