<?php

namespace Coruja\UserBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class CorujaUserBundle extends Bundle
{
    public function getParent()
    {
        return 'FOSUserBundle';
    }
}
