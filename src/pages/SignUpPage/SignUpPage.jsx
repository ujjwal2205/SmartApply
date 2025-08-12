import React from 'react'
import SignUp from '../../components/SignUp/SignUp'
function SignUpPage({setLogin}) {
  return (
    <div>
      <SignUp setLogin={setLogin}/>
    </div>
  )
}

export default SignUpPage
