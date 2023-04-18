//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html
import * as lambda from "aws-cdk-lib/aws-lambda"

//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs-readme.html
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"

//https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html
import * as cdk from "aws-cdk-lib"

import { Construct } from "constructs"

export class ProductsAppStack extends cdk.Stack {
   readonly productsFetchHandler: lambdaNodeJS.NodejsFunction 
   //atributo readonly que será utilizado depois na chamada do api gateway

   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props)

      //criando a lambda através do atributo de classe. 
      //usa o thi pra pegar as propriedades na qual a função está inserida
      this.productsFetchHandler = new lambdaNodeJS.NodejsFunction(this, 
         "ProductsFetchFunction", {
            functionName: "ProductsFetchFunction", //é o nome que vai aparecer no console aws
            entry: "lambda/products/productsFetchFunction.ts", //caminho de onde estará o método
            handler: "handler",
            memorySize: 128, //quantidade de memória que será alocada para a função ser executada
            timeout: cdk.Duration.seconds(5), //tempo máximo que a função será executada
            bundling: {
               minify: true, //pega o código e transforma ele no mais enxuto possível (config em tempo de montagem da função lambda)
               sourceMap: false //desliga a geração de mapas para fazer debug              
            },            
         })
   }
}