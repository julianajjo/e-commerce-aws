#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { ECommerceApiStack } from '../lib/ecommerceApi-stack';
import { ProductsAppLayersStack } from '../lib/productsAppLayers-stack';
import { EventsDdbStack } from '../lib/eventsDdb-stack'

const app = new cdk.App();

const env: cdk.Environment = {
  account: "349955741731",
  region: "us-east-1"
}

//as tags são importantes para controlar os custos de cada time que criará recursos no projeto
const tags = {
  cost: "ECommerce",
  team: "SiecolaCode"
}

const productsAppLayersStack = new ProductsAppLayersStack(app, "ProductsAppLayers", {
  tags: tags,
  env: env
})

const eventsDdbStack = new EventsDdbStack(app, "EventsDdb", {
  tags: tags,
  env: env
})

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  eventsDdb: eventsDdbStack.table,
  tags: tags,
  env: env
})
productsAppStack.addDependency(productsAppLayersStack)
productsAppStack.addDependency(eventsDdbStack)

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApi", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags: tags,
  env: env
})
// deve-se ter um entendimento de qual stack que deve ser criada primeiro, para não interferir em alguma dependência que tenham uma com a outra
// abaixo deixamos claro que a stack eCommerceApiStack depende da productsAppStack, então esta deverá ser criada primeiro e não o contrário
eCommerceApiStack.addDependency(productsAppStack)