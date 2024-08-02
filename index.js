//Módulos externos
import inquirer from 'inquirer';
import chalk from 'chalk';

//Módulos internos
import fs from 'fs';

console.log('Iniciamos o Accounts');

operation();

//Função que irá servir como "menu"
function operation() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    }])
    .then((answer) => {
        const action = answer['action'];

        //Switch case para navegar pelo menu do banco
        switch(action) {
            case 'Criar Conta':
                criandoConta();
                break;
            case 'Depositar':
                depositar();
                break;
            case 'Consultar Saldo':
                consultarSaldo();
                break;
            case 'Sacar':
                sacar();
                break;
            case 'Sair':
                console.log(chalk.bgYellow.black('Volte sempre!'));
                process.exit();
                break;
            default:
                console.log(chalk.bgRed.black('Opção inválida!'));
                operation();
        }
    })
    .catch((err) => console.log(err));
}

//Função para escolher que deseja criar conta
function criandoConta() {
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'));
    console.log(chalk.bgGreen.black('Defina as opções da sua conta a seguir: '));

    construindoConta();
}

//Função para criar a conta
function construindoConta() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para a sua conta: ' 
        }
    ]).then(answer => {
        const nomeConta = answer['accountName'];

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts');
        }

        if (fs.existsSync(`accounts/${nomeConta}.json`)) {
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome'));
            construindoConta();
            return;
        }

        fs.writeFileSync(`accounts/${nomeConta}.json`, '{"balance": 0}');
        console.log(chalk.bgGreen.black('Parabéns, sua conta foi criada!'));

        operation();
    })
    .catch(err => console.log(err));
}

//Adicionar a conta do usuário
function depositar() {
    inquirer.prompt([
        {
            name: 'nomeConta',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {
        const nomeConta = answer['nomeConta'];

        if (!checarConta(nomeConta)) {
            return;
        }

        inquirer.prompt([
            {
                name: 'saldo',
                message: 'Quanto você deseja depositar?'
            }
        ])
        .then((answer) => {
            const amount = parseFloat(answer['saldo']);

            if (isNaN(amount) || amount <= 0) {
                console.log(chalk.bgRed.black('Valor inválido. Tente novamente.'));
                depositar();
                return;
            }

            addSaldo(nomeConta, amount);
            console.log(chalk.bgGreen.black('Depósito realizado com sucesso!'));

            operation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

//Função para verificar se a conta já existe
function checarConta(nomeConta) {
    if (!fs.existsSync(`accounts/${nomeConta}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe! Tente novamente.'));
        return false;
    }
    return true;
}

//Adição de saldo
function addSaldo(nomeConta, amount) {
    const conta = getConta(nomeConta);

    conta.balance += amount;

    fs.writeFileSync(`accounts/${nomeConta}.json`, JSON.stringify(conta));
}

//Função para obter dados da conta
function getConta(nomeConta) {
    const contaJSON = fs.readFileSync(`accounts/${nomeConta}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    });

    return JSON.parse(contaJSON);
}

//Função para consultar saldo
function consultarSaldo() {
    inquirer.prompt([
        {
            name: 'nomeConta',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {
        const nomeConta = answer['nomeConta'];

        if (!checarConta(nomeConta)) {
            return;
        }

        const conta = getConta(nomeConta);
        console.log(chalk.bgBlue.black(`O saldo da conta ${nomeConta} é: R$ ${conta.balance.toFixed(2)}`));

        operation();
    })
    .catch((err) => console.log(err));
}

//Função para sacar saldo
function sacar() {
    inquirer.prompt([
        {
            name: 'nomeConta',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {
        const nomeConta = answer['nomeConta'];

        //Validando nome da conta
        if (!checarConta(nomeConta)) {
            return;
        }

        //Colocar o prompt
        inquirer.prompt([
            {
                name: 'saldo',
                message: 'Quanto você deseja sacar?'
            }
        ])
        // Awnser como o parâmetro acessor
        .then((answer) => {
            const amount = parseFloat(answer['saldo']);

            if (isNaN(amount) || amount <= 0) {
                console.log(chalk.bgRed.black('Valor inválido. Tente novamente.'));
                sacar();
                return;
            }

            const conta = getConta(nomeConta);

            if (amount > conta.balance) {
                console.log(chalk.bgRed.black('Saldo insuficiente.'));
                sacar();
                return;
            }

            conta.balance -= amount;
            fs.writeFileSync(`accounts/${nomeConta}.json`, JSON.stringify(conta));
            console.log(chalk.bgGreen.black('Saque realizado com sucesso!'));

            operation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}
