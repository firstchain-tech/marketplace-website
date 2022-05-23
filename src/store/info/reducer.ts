const initState = {
  igoList: [],
  igoDefaultEmail: '',
}

function reducer(state = initState, action: any) {
  const { type } = action

  switch (type) {
    case 'setInfo':
      return {
        ...state,
        igoList: action.res.igoList,
        igoDefaultEmail: action.res.igoDefaultEmail,
      }
    default:
      return state
  }
}
export default reducer
