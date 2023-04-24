import { FormEvent, useState } from 'react'
import { Card } from './components/Card'
import './styles/styles.css'
import { v4 as uuidV4 } from 'uuid'

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { DropResult } from 'react-beautiful-dnd'

import Logo from './assets/Logo_Trello.gif'

const initialItems = [
  { id: uuidV4(), content: 'Teste de conteudo 1' },
  { id: uuidV4(), content: 'Teste de conteudo 2' },
  { id: uuidV4(), content: 'Teste de conteudo 3' },
]

const initialColumns = [
  {
    name: 'A fazer',
    id: '1',
    items: initialItems
  },
  {
    name: 'Fazendo',
    id: '2',
    items: []


  }


]

function App() {
  const [columns, setColumns] = useState(initialColumns)
  const [nameColumn, setNameColumn] = useState('')
  const [nameCard, setNameCard] = useState('')
  const [isForm, setIsForm] = useState(false)
  const [isFormCard, setIsFormCard] = useState('')

  /* const [sourceColumnId, setSourceColumnId] = useState('')
  const [destinationColumnId, setDestinationColumnId] = useState('') */

  function handleSubmitCard(e: FormEvent, id: string) {
    e.preventDefault()

    const newColumns = columns

    const newColumnsAltered = newColumns.map(column => {
      if (column.id === id) {
        const newCard = {
          id: uuidV4(),
          content: nameCard
        }

        column.items.push(newCard)

        return
      }
      return column
    })

    console.log(newColumnsAltered)

    setNameCard(``)
    setIsFormCard('null')

    console.log(`aqiui!`, id, nameCard)
  }

  function handleSubmitColumn(e: FormEvent) {
    e.preventDefault()

    if (nameColumn === '') {

      return alert(`Preencha o nome da lista`)
    }

    const newColumn = {
      id: String(columns.length + 1),
      name: nameColumn,
      items: []
    }

    setColumns([...columns, newColumn])
    setIsForm(false)
    setNameColumn('')
  }

  function onDragEnd(result: DropResult) {
    var columnDragged = {} as any
    var sourceColumnItems = [] as any
    var destinationColumnItems = [] as any
    var draggedItem = {} as any

    var sourceColumnId
    var destinationColumnId

    console.log(sourceColumnId, 'TESTANDO')

    for (var i in columns) {
      if (columns[i].id === result.source.droppableId) {
        sourceColumnItems = columns[i].items
        /* sourceColumnId = i */
        sourceColumnId = i
      } else if (columns[i].id === result.destination?.droppableId) {
        destinationColumnItems = columns[i].items
        /* destinationColumnId = i */
        destinationColumnId = i
      }
    }



    if (result.destination?.droppableId === result.source.droppableId && result.destination.index === result.source.index) {
      return
    }

    if (!result.destination) {
      return
    }

    // Persistindo ordem das colunas
    if (result.type === 'column') {

      // Peguei coluna arrastada
      for (var i in columns) {
        if (columns[i].id === result.draggableId) {
          columnDragged = columns[i]
        }
      }

      const newColumns = columns
      newColumns.splice(result.source.index, 1)
      newColumns.splice(result.destination.index, 0, columnDragged)

      setColumns(newColumns)

    }


    // Pega o objeto arrastado
    for (var i in sourceColumnItems) {
      if (sourceColumnItems[i].id === result.draggableId) {
        draggedItem = sourceColumnItems[i]
      }
    }

    // Excluir o objeto arrastado
    const filteredSourceColumnItems = sourceColumnItems.filter((item: any) => item.id !== result.draggableId)

    // Adicionar o mesmo na nova posição
    if (result.destination.droppableId === result.source.droppableId) {
      filteredSourceColumnItems.splice(result.destination.index, 0, draggedItem)

      // Mudar o state
      var columnCopy = JSON.parse(JSON.stringify(columns))

      const souceColumnIdNumber = Number(sourceColumnId)

      columnCopy[souceColumnIdNumber]!.items = filteredSourceColumnItems
      setColumns(columnCopy)

    } else {
      destinationColumnItems.splice(result.destination.index, 0, draggedItem)
      // Mudar o state
      var columnCopy = JSON.parse(JSON.stringify(columns))
      columnCopy[Number(sourceColumnId)].items = filteredSourceColumnItems
      columnCopy[Number(destinationColumnId)].items = destinationColumnItems
      setColumns(columnCopy)

    }


  }


  return (
    <div>
      <header className='w-full h-12 bg-[#0395af] border-b-[#35a7bc] flex items-center p-2'>
        <button className='flex items-center justify-center bg-transparent h-8 w-8 hover:bg-[#219db7] rounded'>
          <svg width="20" height="20" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M4 5C4 4.44772 4.44772 4 5 4H7C7.55228 4 8 4.44772 8 5V7C8 7.55228 7.55228 8 7 8H5C4.44772 8 4 7.55228 4 7V5ZM4 11C4 10.4477 4.44772 10 5 10H7C7.55228 10 8 10.4477 8 11V13C8 13.5523 7.55228 14 7 14H5C4.44772 14 4 13.5523 4 13V11ZM11 4C10.4477 4 10 4.44772 10 5V7C10 7.55228 10.4477 8 11 8H13C13.5523 8 14 7.55228 14 7V5C14 4.44772 13.5523 4 13 4H11ZM10 11C10 10.4477 10.4477 10 11 10H13C13.5523 10 14 10.4477 14 11V13C14 13.5523 13.5523 14 13 14H11C10.4477 14 10 13.5523 10 13V11ZM17 4C16.4477 4 16 4.44772 16 5V7C16 7.55228 16.4477 8 17 8H19C19.5523 8 20 7.55228 20 7V5C20 4.44772 19.5523 4 19 4H17ZM16 11C16 10.4477 16.4477 10 17 10H19C19.5523 10 20 10.4477 20 11V13C20 13.5523 19.5523 14 19 14H17C16.4477 14 16 13.5523 16 13V11ZM5 16C4.44772 16 4 16.4477 4 17V19C4 19.5523 4.44772 20 5 20H7C7.55228 20 8 19.5523 8 19V17C8 16.4477 7.55228 16 7 16H5ZM10 17C10 16.4477 10.4477 16 11 16H13C13.5523 16 14 16.4477 14 17V19C14 19.5523 13.5523 20 13 20H11C10.4477 20 10 19.5523 10 19V17ZM17 16C16.4477 16 16 16.4477 16 17V19C16 19.5523 16.4477 20 17 20H19C19.5523 20 20 19.5523 20 19V17C20 16.4477 19.5523 16 19 16H17Z" fill="#fff">
            </path>
          </svg>
        </button>
        <button className='flex items-center justify-center bg-transparent h-8 px-2 hover:bg-[#219db7] rounded'>
          <img src={Logo} alt="" className='w-[75px]' />
        </button>
      </header>
      <DragDropContext onDragEnd={onDragEnd}>

        <Droppable droppableId='all-columns' direction='horizontal' type='column'>
          {
            (provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className='w-screen h-screen bg-[#00AECC] p-8 overflow-auto flex gap-4'>
                <div className='inline-flex gap-4'>
                  {
                    columns.map((column, index) => {
                      return (
                        <Draggable draggableId={column.id} index={index} key={column.id}>
                          {
                            (provided, snapshotColumn) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className={` flex flex-col w-[272px] bg-[#F7F8F9] rounded-xl h-fit shadow-[0px_1px_1px_#091E4240,0px_0px_1px_#091E424F]`}
                                key={column.id}
                              >

                                <header

                                  className='py-3 px-2 flex justify-between' >
                                  <h2 className='py-1 px-3 font-semibold text-sm'>{column.name}</h2>
                                  <button className='px-3'>...</button>
                                </header>



                                <Droppable droppableId={column.id} key={column.id}>
                                  {
                                    (provided, snapshotDrop) => (
                                      <>
                                        <main
                                          {...provided.droppableProps}
                                          ref={provided.innerRef}
                                          className={`h-fit mx-1 px-1 min-h-[1px] flex flex-col gap-1 rounded-xl`}
                                        >

                                          {
                                            column.items.map((item, index) => {
                                              return (
                                                <Draggable draggableId={item.id} index={index} key={item.id}>
                                                  {
                                                    (provided, snapshot) => (
                                                      <div
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}

                                                      >

                                                        <Card title={item.content} className={`${snapshot.isDragging ? 'rotate-3' : 'rotate-0'}  bg-white rounded-lg mb-2 pl-3 pt-2 pb-8 pr-2 shadow-[0px_1px_1px_#091E4240,0px_0px_1px_#091E424F]`} />

                                                      </div>
                                                    )
                                                  }

                                                </Draggable>
                                              )
                                            }

                                            )
                                          }

                                        </main>
                                        {provided.placeholder}
                                      </>

                                    )
                                  }
                                </Droppable>


                                <footer className='mx-2 mb-2 flex'>
                                  {
                                    isFormCard === column.id ? (
                                      <div className='flex flex-col flex-1'>
                                        <form action="" id='card' onSubmit={(e) => handleSubmitCard(e, column.id)} className='flex bg-white rounded-lg mb-2 px-1 pt-2 pb-2 shadow-[0px_1px_1px_#091E4240,0px_0px_1px_#091E424F]'>
                                          <textarea className='h-full w-full px-2 mb-2 rounded border-none outline-none resize-none' name='name' value={nameCard} onChange={e => setNameCard(e.target.value)} placeholder='Insira o título para este cartão...' />
                                        </form>
                                        <div className='flex gap-4 mt-2'>
                                          <button type='submit' form='card' className='bg-blue-600 text-white rounded-md text-sm px-3 py-2 w-fit'>Adicionar Cartão</button>
                                          <button onClick={() => setIsFormCard('')}>X</button>
                                        </div>
                                      </div>
                                    ) : (
                                      <button onClick={() => setIsFormCard(column.id)} className='flex items-center gap-2 w-full p-2 hover:bg-gray-300 rounded-lg text-sm'>
                                        <span className='text-xl'>+</span> Adicionar um cartão
                                      </button>
                                    )
                                  }

                                </footer>


                              </div>
                            )
                          }
                        </Draggable>
                      )

                    })

                  }




                  {provided.placeholder}
                </div>
                {
                  isForm ? (
                    <div>
                      <form action="" onSubmit={handleSubmitColumn} className='flex flex-col py-3 px-2 w-[272px] bg-gray-200 rounded-xl h-fit shadow-[0px_1px_1px_#091E4240,0px_0px_1px_#091E424F]'>
                        <input className='h-8 py-2 px-3 mb-2 rounded' type="text" name='name' value={nameColumn} onChange={e => setNameColumn(e.target.value)} placeholder='Insira o título da lista...' />
                        <div className='flex gap-4'>
                          <button type='submit' className='bg-blue-600 text-white rounded-md text-sm px-3 py-2 w-fit'>Adicionar Lista</button>
                          <button onClick={() => setIsForm(false)}>X</button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div>
                      <button
                        className='w-[272px] h-fit p-4 bg-[#ffffff3d;] rounded-xl text-white text-left'
                        onClick={() => setIsForm(true)}
                      >+ Adicionar outra lista</button>
                    </div>
                  )
                }

              </div>



            )
          }







        </Droppable>

      </DragDropContext >
    </div>
  )
}

export default App


