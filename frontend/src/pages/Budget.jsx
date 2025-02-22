import React, { useState } from 'react'
import Navbar from '../component/Navbar'
import BudgetTable from '../component/BudgetTable'
import UpdateIncome from '../component/UpdateIncome'

function Budget() {

  const [openIncomeUpdate, setOpenIncomeUpdate] = useState(false)

  return (
    <div>
      <Navbar setOpenIncomeUpdate={setOpenIncomeUpdate} />
      {
        openIncomeUpdate && <UpdateIncome setOpenIncomeUpdate={setOpenIncomeUpdate} />
      }
      <BudgetTable />
    </div>
  )
}

export default Budget