#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { ECommerceApiStack } from '../lib/ecommerceApi-stack';

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

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  tags: tags,
  env: env
})

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApi", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags: tags,
  env: env
})
// deve-se ter um entendimento de qual stack que deve ser criada primeiro, para não interferir em alguma dependência que tenham uma com a outra
// abaixo deixamos claro que a stack eCommerceApiStack depende da productsAppStack, então esta deverá ser criada primeiro e não o contrário
eCommerceApiStack.addDependency(productsAppStack)