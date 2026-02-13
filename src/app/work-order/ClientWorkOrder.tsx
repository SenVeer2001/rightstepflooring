import React from 'react'

import { staticWorkOrders } from '../../services/orderdata'
import ClientWorkOrderTable from './ClientWorkOrderTable';

function ClientWorkOrder() {
  return (
    <div>
        <ClientWorkOrderTable workOrders={staticWorkOrders} />
    </div>
  )
}

export default ClientWorkOrder;