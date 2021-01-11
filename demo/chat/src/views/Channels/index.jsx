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
import { describeChannel, createChannel } from '../../api/ChimeAPI';
import appConfig from '../../Config';
import Person from './Avatar1.png';

const Channels = () => {
  const dispatch = useNotificationDispatch();
  const currentTheme = useTheme();
  const [showSidebar, setShowSidebar] = useState(false);
  const [location, setLocation] = useState('sydney');
  const [modal, setModal] = useState('');

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
    setActiveChannel,
  } = useChatChannelState();

  const handleProfileClick = () => {
    setShowSidebar(!showSidebar);
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const addChannels = async (channelNames) => {
    const mode = 'RESTRICTED';
    const privacy = 'PRIVATE';
    const userId = member.userId;

    const channelsArns = Promise.all(
      channelNames.map(async (channelName) => {
        return await createChannel(
          appConfig.appInstanceArn,
          channelName,
          mode,
          privacy,
          userId
        );
      })
    );

    if (channelsArns.length > 0) {
      const channels = Promise.all(
        channelsArns.map(async (arn) => {
          return await describeChannel(arn, userId);
        })
      );

      if (true) {
        setModal('');
        setChannelList([...channelList, ...channels]);
        //setActiveChannel(channels[0]);
        //channelIdChangeHandler(channels[0].ChannelArn);
      }
    }

    await sleep(3000);
    dispatch({
      type: 0,
      payload: {
        message: "You've been matched with new patients!",
        severity: 'success',
        autoClose: true,
      },
    });
  };

  const handleLocationChange = async () => {
    setLocation('brisbane');

    // get response from AWS lambda
    fetch(
      'https://niqwtahfb6.execute-api.us-east-1.amazonaws.com/default/MatchingService',
      {
        mode: 'cors',
      }
    )
      .then((response) => response.json())
      .then((data) => addChannels(data));

    // add channels based on response
    //addChannels(["Olivia Taylor", "Jonathan Washington"]);
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
    height: calc(100% - (48px + 1rem));
  `;

  const SidebarSection = styled.div`
    padding: 16px;
    border: 1px solid #e2e1df;
  `;

  const Settings = styled(SidebarSection)`
    background-color: #f5f5f4;
    border: none;
    display: flex;
    justify-content: space-between;
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
            <div
              className="messaging-container"
              style={{ backgroundColor: 'white' }}
            >
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
                style={{ backgroundColor: 'white' }}
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
            <Settings>
              <strong>
                <span>My Account Settings</span>
              </strong>
              <strong>
                <span
                  role="presentation"
                  onClick={() => setShowSidebar(false)}
                  style={{ cursor: 'pointer', color: '#00a963' }}
                >
                  X
                </span>
              </strong>
            </Settings>
            <SidebarSection style={{ display: 'flex', alignItems: 'center' }}>
              <img src={Person} alt="sdfg" style={{ marginRight: '8px' }} />
              <b>{member.username}</b>
            </SidebarSection>
            <SidebarSection>
              <b>Gender: </b>Female
            </SidebarSection>
            <SidebarSection>
              <b>DOB: </b>16 Apr 1969 (age 48)
            </SidebarSection>
            <SidebarSection>
              <b>Tumour Stream: </b>Breast Cancer
            </SidebarSection>
            <SidebarSection>
              <b>Location: </b>
              <select onChange={handleLocationChange} value={location}>
                <option value="sydney">Sydney</option>
                <option value="brisbane">Brisbane</option>
                <option value="melbourne">Melbourne</option>
              </select>
            </SidebarSection>
            <SidebarSection>
              <b>Bio:</b>
              <div>
                I was diagnosed with breast cancer four years ago and have been
                cancer free for the last two years.
              </div>
              <br></br>
              <div>
                Just moved to Brisbane looking to connect with new Brisbane
                based patients and survivors.
              </div>
            </SidebarSection>
          </Sidebar>
        )}
      </Cell>
    </Grid>
  );
};

export default Channels;
