import React from 'react'
import {
  IoMdChatbubbles,
} from 'react-icons/io'
const CommentContainer = (props) => {
  return (
    <div style={{ margin: 'auto', height: '100%', width: '40px', position: 'relative', padding: '0px 2px', cursor: 'pointer' }}>
      <IoMdChatbubbles size='20' color='#4285F4' />
      <div className="comment-cointainer">
        {props.remark}
      </div>
    </div>
  )
}
export default CommentContainer