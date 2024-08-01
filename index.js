//Modulos externos
import inquirer from 'inquirer'
import chalk from 'chalk'

//Modulos internos
import fs, { existsSync } from 'fs'
import { ADDRGETNETWORKPARAMS } from 'dns'


console.log('Iniciamos o Accounts')

operation()

//Função que irá servir como "menu"
function operation() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que voce deseja fazer?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    }])
    .then((answer) => {
        const action = answer['action']

        if(action === "Criar Conta") {
            criandoConta()
        } else if (action == 'Depositar') {
            depositar()

        } else if (action == 'Consultar Saldo') {

        } else if (action == 'Sacar') {

        } else if (action == 'Sair') {
            console.log(chalk.bgYellow.black('Volte sempre!'))
            process.exit()
        }
    })
    .catch((err) => console.log(err))
}


//Função para escolher que desejas criar conta
function criandoConta () {
    console.log(chalk.bgGreen.black('Parabens por escolher o nosso banco!'))
    console.log(chalk.bgGreen.black('Defina as opções da sua conta a seguir: '))

    construindoConta()
    
}

//Função para criar a conta
function construindoConta() {
    inquirer.prompt([
        {
            name: 'acountName',
            message: 'Digite um nome para a sua conta: ' 
        }
    ]).then(answer => {
        const nomeConta = answer['acountName']

        console.info(nomeConta)

        if(!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${nomeConta}.json`)) {
            console.log(
                chalk.bgRed.black('Esta conta já existe, escolha outro nome'),
            )
            construindoConta()
            return
        }

        fs.writeFileSync(`accounts/${nomeConta}.json`, '{"balance": 0}', (err) => {
            console.log(err)
        })

        console.log(chalk.bgGreen.black('Parabens, sua conta foi criada!'))

        operation()
    })
    .catch(err => console.log(err))
}

//Adicionar a conta de um usuário
function depositar() {

    inquirer.prompt([
        {
            name: 'nomeConta',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {
        const nomeConta = answer['nomeConta']

        //Verificar existencia da conta
        if(!checarConta(nomeConta)) {
            return depositar()
        }

        inquirer.prompt([
            {
                name: 'saldo',
                message: 'Quanto que desejas depositar?'
            }
        ])
        .then((answer) => {

            const amount = answer['saldo']

            //Adicionar saldo
            addSaldo(nomeConta, valorConta)

            operation()

        })
        .catch((err) => console.log(err))
        
    })
    .catch((err) => console.log(err))

}


//Função para verificar se a conta já existe
function checarConta(nomeConta) {

    if(!fs.existsSync(`accounts/${nomeConta}.json`)) {
        console.log(chalk.bgRed.black('Esta conta nao existe!!! Tente novamente'))
        return false
    }
    
    return true

}


//Adição de saldo
function addSaldo(nomeConta, valorConta) {

    const conta  = getConta(nomeConta)

    console.log(conta)

}

function getConta(nomeConta) {
    const contaJSON = fs.readFileSync(`accounts/${nomeConta}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    })

    return JSON.parse(contaJSON)

}