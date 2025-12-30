<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class AbstractRepository {

    public function __construct(Model $model) {

        $this->model = $model;
    }

    public function selectAtributos($atributos) {

        $this->model = $this->model->selectRaw($atributos);
    }

    public function selectWith($with) {

        $withs = explode(',', $with);

        foreach($withs as $key => $with) {

            $this->model = $this->model->with($with);
        }        
    }

    public function filter($filters) {

        $filters = explode(';', $filters);

        foreach ($filters as $key => $condicao) {

            $parametros = explode(':', $condicao);

            $this->model = $this->model->orWhere($parametros[0], $parametros[1], $parametros[2]);
        }
    }

    public function extendedFilter($extendedFilter) {

        $extendedFilter = explode(',', $extendedFilter);
        
        $parameters = explode(':', $extendedFilter[1]);
        
        $this->model = $this->model->whereHas($extendedFilter[0], function (Builder $query) use ($parameters) {
            $query->where($parameters[0], $parameters[1], $parameters[2]);
        });
    }

    public function sort($sort) {

        $sorts = explode(',', $sort);

        foreach($sorts as $key => $sort) {

            $this->model = $this->model->orderByRaw($sort);
        }        
    }

    public function getResultado() {

        return $this->model->get();
    }
}