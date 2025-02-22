import React, {useState} from 'react'
import Navbar from '../component/Navbar'
import TransactionTable from '../component/TransactionTable'
import UpdateIncome from '../component/UpdateIncome'

function Transaction() {

  const [openIncomeUpdate, setOpenIncomeUpdate] = useState(false)

  return (
    <div>
      <Navbar setOpenIncomeUpdate={setOpenIncomeUpdate} />
      {
        openIncomeUpdate && <UpdateIncome setOpenIncomeUpdate={setOpenIncomeUpdate} />
      }
      <TransactionTable />
    </div>
  )
}

export default Transaction