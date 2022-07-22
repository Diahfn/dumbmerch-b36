import React from 'react'
import '../Styles.css'

import imgBlank from '../../Assets/blank-profile.png'

export default function Chat({ contact, user, messages, sendMessage }) {

    return (
        <>
            {contact ? (
                <>
                    <div id='chat-messages' className='overflow-auto px-3 mx-2 py-2' style={{height: '77vh'}}>
                        {messages.map((item, index) => (
                            <div key={index}>
                                <div className={`d-flex py-1 ${item.idSender === user.id ? 'justify-content-end' : 'justify-content-start'}`}>
                                    {item.idSender !== user.id && (
                                        <img src={contact.profile?.image || imgBlank} className='rounded-circle me-2 img-chat' alt='bubble avatar' />
                                    )}
                                    <div className={item.idSender === user.id ? 'chat-me' : 'chat-other'}>
                                        {item.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{height: '6vh'}} className='px-3'>
                        <input
                            placeholder='Send Messages'
                            className='input-message px-3'
                            onKeyPress={sendMessage}
                        />
                    </div>
                </>
                )
                : (
                    <div style={{height: '73vh'}} className='h4 d-flex justify-content-center align-items-center'>
                        No Message
                    </div>
                )
            }
        </>
    )
}
