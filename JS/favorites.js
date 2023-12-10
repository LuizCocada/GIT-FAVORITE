import { GithubUsers } from "./GithubUsers.js"

//ESTRUTURAS DOS DADOS
export class favorite {
    constructor(root){
        this.root = document.querySelector(root)
        this.load()
    }

    //CARREGAMENTO DE DADOS
    load(){
        this.entries = JSON.parse(localStorage.getItem('@favorites-github:')) || []
    }

    save(){
        localStorage.setItem('@favorites-github:', JSON.stringify(this.entries) )
    }

    

    async add(username){
        try{

            const userExist = this.entries.find(entry => entry.login.toLowerCase() === username.toLowerCase())

            if(userExist) {
                throw new Error('Usuario ja cadastrado')
            }



            const user = await GithubUsers.search(username)

            if(user.login === undefined){
                throw new Error('Usuario nao encontrado')
            }

            this.entries = [user, ...this.entries]
            this.updade()
            this.save()


        } catch(error){
            alert(error.message)
        }

    }

    delete(user){                                               //retornar falso tira do array.
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.updade()
        this.save()
    }

}



//VIZUALIZAÇAO e EVENTOS do HTML
export class favoritesView extends favorite{
    constructor(root){
        super(root)

        this.hideStar = this.root.querySelector('.noUser') 
        this.tbody = this.root.querySelector('table tbody')

        this.updade()
        this.onAdd()

    }
    
    onAdd(){
        const addButton = this.root.querySelector('.input-search button')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.input-search input')

            this.add(value)
        }
    }


    updade(){
        this.removeAlltr()
        

        this.entries.forEach( user => {
            const row = this.creatRow()
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user a ').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = `/${user.login}`
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            row.querySelector('.remove').onclick = () => {
                const isOk =  confirm('tem certeza que deseja deletar esse usuario?')
                if(isOk){
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })

        this.favoriteExist()
    }


    creatRow(){
        const tr = document.createElement('tr')
        tr.innerHTML = `<td class="user">
        <img src="https://github.com/Luizcocada.png" alt="imagem de Luizcocada">
        <a href="https://github.com/Luizcocada" target="_blank">
            <p>Luizcocada</p>
            <span>Luizcocada</span>
        </a>
        </td>
        <td class="repositories">
            76
        </td>
        <td class="followers">
            9589
        </td>
        <td>
            <button class="remove">Remover</button>
        </td>`

        return tr
    }

    removeAlltr(){
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }

    favoriteExist(){ 
        if(this.entries.length <=0){
            this.hideStar.classList.remove('hide')
        }
        if(this.entries.length >=1){
            this.hideStar.classList.add('hide')
        }
    }
}