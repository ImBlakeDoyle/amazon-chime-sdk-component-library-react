/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import styled from 'styled-components';
import Avatar from 'react-avatar';
import {
  Heading,
  Grid,
  Cell,
  useNotificationDispatch,
} from 'amazon-chime-sdk-component-library-react';
import { useTheme } from 'styled-components';
import ChannelsWrapper from '../../containers/channels/ChannelsWrapper';
import Messages from '../../containers/messages/Messages';
import Input from '../../containers/input/Input';
import './style.css';
import {
  useChatChannelState,
  useChatMessagingState,
} from '../../providers/ChatMessagesProvider';
import { useAuthContext } from '../../providers/AuthProvider';
import logo from './logo.png';
import GCLogo from './GCLogo.png';

const Channels = () => {
  const currentTheme = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);

  const { member, userSignOut } = useAuthContext();
  const {
    messages,
    messagesRef,
    setMessages,
    onReceiveMessage,
  } = useChatMessagingState();
  const notificationDispatch = useNotificationDispatch();

  const {
    setChannelMessageToken,
    setChannelList,
    activeChannel,
    activeChannelRef,
    channelList,
    hasMembership,
  } = useChatChannelState();

  const handleProfileClick = () => {
    setShowSidebar(!showSidebar);
  };

  const HeadingWrapper = styled.div`
    position: absolute;
    width: 100%;
  `;

  const Sidebar = styled.div`
    position: absolute;
    top: calc(48px + 1rem);
    right: 0;
    background-color: white;
    border: 2px solid #f5f5f4;
    height: calc(100% - (48px + 1rem));
    width: 320px;
    z-index: 999;
  `;

  const SidebarSection = styled.div`
    padding: 16px;
    border: 1px solid #e2e1df;
  `;

  const StyledGCLogo = styled.img`
    margin-right: 20px;
  `;

  return (
    <Grid
      gridTemplateColumns="1fr 10fr"
      gridTemplateRows="3rem 101%"
      style={{ width: '100vw', height: '100vh' }}
      gridTemplateAreas='
      "heading heading"
      "side main"      
      '
    >
      <Cell gridArea="heading">
        <HeadingWrapper>
          {/* HEADING */}
          <Heading
            level={5}
            style={{
              backgroundColor: 'white',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)',
              height: '4rem',
              paddingLeft: '1rem',
              color: '2E2E2e',
              display: 'flex',
              alignItems: 'center',
            }}
            className="app-heading"
          >
            <StyledGCLogo src={GCLogo} alt="GC logo" />
            <img src={logo} alt="PatientMatchLogo" />
            <div className="user-block">
              <a className="user-info" href="#" onClick={handleProfileClick}>
                <Avatar
                  name={member.username}
                  size="30"
                  textSizeRatio={1.25}
                  round
                />
              </a>

              <a href="#" onClick={userSignOut}>
                Log out
              </a>
            </div>
          </Heading>
        </HeadingWrapper>
      </Cell>
      <Cell
        gridArea="side"
        style={{
          height: 'calc(100% - 5rem)',
          backgroundColor: '#F5F5F4',
          marginTop: '1rem',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRight: `solid 1px ${currentTheme.colors.greys.grey30}`,
          }}
        >
          {/* SIDEPANEL CHANNELS LIST */}
          <ChannelsWrapper />
        </div>
      </Cell>
      <Cell
        gridArea="main"
        style={{ height: 'calc(100% - 5rem)', marginTop: '1rem' }}
      >
        {/* MAIN CHAT CONTENT WINDOW */}
        {activeChannel.ChannelArn ? (
          <>
            <div className="messaging-container">
              <Messages
                messages={messages}
                messagesRef={messagesRef}
                setMessages={setMessages}
                currentMember={member}
                onReceiveMessage={onReceiveMessage}
                setChannelList={setChannelList}
                channelList={channelList}
                channelArn={activeChannelRef.current.ChannelArn}
                setChannelMessageToken={setChannelMessageToken}
                activeChannelRef={activeChannelRef}
                channelName={activeChannel.Name}
                userId={member.userId}
              />
              <Input
                style={{
                  borderTop: `solid 1px ${currentTheme.colors.greys.grey40}`,
                }}
                activeChannelArn={activeChannel.ChannelArn}
                member={member}
                hasMembership={hasMembership}
              />
            </div>
          </>
        ) : (
          <div className="placeholder">Welcome</div>
        )}
        {showSidebar && (
          <Sidebar>
            <SidebarSection>{member.username}</SidebarSection>
          </Sidebar>
        )}
      </Cell>
    </Grid>
  );
};

export default Channels;
