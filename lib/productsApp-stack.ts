//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html
import * as lambda from "aws-cdk-lib/aws-lambda"

//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"

//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html
import * as cdk from "aws-cdk-lib"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as ssm from "aws-cdk-lib/aws-ssm"

import { Construct } from "constructs"

export class ProductsAppStack extends cdk.Stack {
   //Abaixo, as permissões:
   readonly productsFetchHandler: lambdaNodeJS.NodejsFunction
   readonly productsAdminHandler: lambdaNodeJS.NodejsFunction
   readonly productsDdb: dynamodb.Table

   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props)

      //Criação da tabela:
      this.productsDdb = new dynamodb.Table(this, "ProductsDdb", {
         tableName: "products",
         //O padrão para removalPolicy qnd a stacké destruída é de manter (RETAIN)
         //Aqui deixamos destroy pra caso quisermos iniciar o projeto do zero em algum momento
         removalPolicy: cdk.RemovalPolicy.DESTROY,
         partitionKey: {
            name: "id",
            type: dynamodb.AttributeType.STRING
         },
         billingMode: dynamodb.BillingMode.PROVISIONED,
         readCapacity: 1, //O padrão é 5
         writeCapacity: 1 //O padrão é 5
      })

      //Products Layer
      const productsLayerArn = ssm.StringParameter.valueForStringParameter(this, "ProductsLayerVersionArn")
      const productsLayer = lambda.LayerVersion.fromLayerVersionArn(this, "ProductsLayerVersionArn", productsLayerArn)
      
      //criando a lambda através do atributo de classe. 
      //usa o thi pra pegar as propriedades na qual a função está inserida
      this.productsFetchHandler = new lambdaNodeJS.NodejsFunction(this, 
         "ProductsFetchFunction", {
            functionName: "ProductsFetchFunction", //é o nome que vai aparecer no console aws
            entry: "lambda/products/productsFetchFunction.ts", //caminho de onde estará o método
            handler: "handler",
            memorySize: 128, //quantidade de memória que será alocada para a função ser executada
            timeout: cdk.Duration.seconds(5),
            bundling: {
               minify: true,
               sourceMap: false               
            },            
            environment: {
               PRODUCTS_DDB: this.productsDdb.tableName
            }, 
            layers: [productsLayer]
         })
      //Abaixo, a permissão para que a função acesse a tabela 
      this.productsDdb.grantReadData(this.productsFetchHandler)

      this.productsAdminHandler = new lambdaNodeJS.NodejsFunction(this, 
         "ProductsAdminFunction", {
            functionName: "ProductsAdminFunction",
            entry: "lambda/products/productsAdminFunction.ts",
            handler: "handler",
            memorySize: 128,
            timeout: cdk.Duration.seconds(5),
            bundling: {
               minify: true, //pega o código e transforma ele no mais enxuto possível (config em tempo de montagem da função lambda)
               sourceMap: false //desliga a geração de mapas para fazer debug              
            },            
            environment: {
               PRODUCTS_DDB: this.productsDdb.tableName
            },
            layers: [productsLayer]
         }) 
      this.productsDdb.grantWriteData(this.productsAdminHandler)
   }
}