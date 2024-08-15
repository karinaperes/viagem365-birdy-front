import { useForm } from 'react-hook-form'
import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import buscaCep from '../../util/buscaCep'
import buscaCoordenadas from '../../util/buscaCoordenadas'

function CadastroDestino() {
    const { register, handleSubmit, setValue, formState } = useForm()
    const [cep, setCep] = useState('')
    const [usuario, setUsuario] = useState({ nome: '', id: ''})
    const navigate = useNavigate()

    useEffect(() => {
        const usuarioNome = localStorage.getItem('usuarioNome') 
        const usuarioId = localStorage.getItem('usuarioId')
        setUsuario({ nome: usuarioNome, id: usuarioId})
    }, [])    

    const onCepChange = async (e) => {
        const cepValue = e.target.value.replace(/\D/g, '')
        setCep(cepValue)
        if (cepValue.length === 8) {
            await buscaCep(cepValue, setValue)         
        }
    }

    const onCoordenadasChange = async (e) => {
        const coordenadasValue = e.target.value;
        if (coordenadasValue) {
           await buscaCoordenadas(coordenadasValue, setValue);
        }
    }

    async function addDestino(data) {
        try {
            const destinoData = {...data, usuarioId: usuario.id}
            const response = await fetch('http://localhost:3000/destinos', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(destinoData)
            })

            if (response.ok === false) {
                alert('Erro ao cadastrar local.')
            } else {
                alert('Cadastro efetuado com sucesso!')
                navigate('/dashboard')

            }

        } catch (error) {
            alert('Erro no cadastro do local.')
        }
    }

    return (
        <>
            <div className='flex-row'>
                <div className='img-lateral'>
                    <img src="../src/imgs/lateral.jpg" alt="Imagem lateral mapa e câmera com capa de couro" />
                </div>
                <div className="container-bg flex-col justify-content-center w-100">
                    <h2 className='titulo'>Cadastro de Local</h2>
                    <div>
                        <form className='container' onSubmit={handleSubmit(addDestino)}>
                            <div className='row'>
                                <div className='col-12'>                                    
                                    <span>ID: {usuario.id} {usuario.nome}</span>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-12'>
                                <span className='error-message'>{formState.errors?.nome?.message}</span><br/>
                                    <input 
                                    className='input-area w-100' 
                                    type="text" 
                                    placeholder='Nome' 
                                    {...register('nome', { required: 'Campo Obrigatório' })} 
                                    />                                    
                                </div>
                            </div>

                            <div className='row'>                                
                                <div className='col-12'>
                                    <span className='error-message'>{formState.errors?.descricao?.message}</span>
                                    <textarea 
                                    className='input-area w-100 descricao-local' 
                                    type="text" 
                                    placeholder='Descrição do local' 
                                    {...register('descricao', { required: 'Adicione uma descrição do local' })} 
                                    />
                                </div>                                
                            </div>

                            <div className='row'>
                                <div className='col-4'>
                                    <span className='error-message'>{formState.errors?.coordenadas?.message}</span>
                                    <input 
                                    className='input-area w-100' 
                                    type="text" 
                                    placeholder='Coordenadas Geográficas' 
                                    {...register('coordenadas', { required: 'Informe a latitude e longitude do local.' })} 
                                    onBlur={onCoordenadasChange}
                                    />
                                </div>
                                <div className='col-2'>
                                    <span className='error-message'>{formState.errors?.cep?.message}</span>
                                    <input 
                                    className='input-area w-100' 
                                    type="text" placeholder='CEP' 
                                    {...register('cep', { required: 'Informe o CEP do local' })} value={cep} onChange={onCepChange} 
                                    />
                                </div>
                                <div className='col-3'>
                                    <span className='error-message'>{formState.errors?.cidade?.message}</span>
                                    <input 
                                    className='input-area w-100' 
                                    type="text" 
                                    placeholder='Cidade' 
                                    {...register('cidade', { required: 'Campo Obrigatório' })} 
                                    />
                                </div>
                                <div className='col-3'>
                                    <span className='error-message'>{formState.errors?.estado?.message}</span>
                                    <input 
                                    className='input-area w-100' 
                                    type="text" 
                                    placeholder='Estado' 
                                    {...register('estado', { required: 'Campo Obrigatório' })} 
                                    />
                                </div>
                            </div>                            

                            <button className='btn-style w-100' type='submit'>Cadastrar</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )    
}

export default CadastroDestino
