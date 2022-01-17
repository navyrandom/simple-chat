import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useSubscription,
  useMutation,
  gql,
} from "@apollo/client";
import { WebSocketLink } from '@apollo/client/link/ws';
import { Container, Button } from "@mui/material";


const link = new WebSocketLink({
  uri: 'ws://localhost:4000/',
  options: {
    reconnect: true
  }
});
const client = new ApolloClient({
  link,
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      content
      user
    }
  }
`;
const POST_MESSAGES = gql`
  mutation ($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;
const Messages = ({ user }) => {
  const { data } = useSubscription(GET_MESSAGES);
  if (!data) {
    return null;
  }
  return (
    <>
      {data.messages.map(({ id, user: messageUser, content }) => (
        <div
          style={{
            display: "flex",
            justifyContent: user === messageUser ? "flex-end" : "flex-start",
            paddingBottom: "1em",
          }}
        >
          {user !== messageUser && (
            <div
              style={{
                height: 50,
                width: 50,
                marginRight: "0.5em",
                border: "1px solid ",
                display:'flex',
                textAlign: "center",
                alignItems:"center",
                fontSize: "1em",
                borderRadius:'50%'
              }}
            >
              {messageUser.slice(0, 4).toUpperCase()}
            </div>
          )}
          <div
            style={{
              background: user === messageUser ? "#58bf56" : "pink",
              color: user === messageUser ? "white" : "black",
              padding: "1em",
              borderRadius: "1em",
              maxWidth: "60%",
            }}
          >
            {content}
          </div>
        </div>
      ))}
    </>
  );
};

const Chat = () => {
  const [state, setState] = React.useState({
    user: "Jack",
    content: "",
  });
  const [postMessage] = useMutation(POST_MESSAGES);
  const onSend = () => {
    if (state.content.length > 0) {
      postMessage({
        variables: state,
      });
    }
    setState({
      ...state,
      content: "",
    });
  };
  return (
    <Container>
      <Messages user={state.user} />
      <Container>
      <input
        label="User"
        value={state.user}
        onChange={(e) =>
          setState({
            ...state,
            user: e.target.value,
          })
        }
      />
      <input
        label="Content"
        value={state.content}
        onChange={(e) =>
          setState({
            ...state,
            content: e.target.value,
          })
        }
        onKeyUp={(e) => {
          if (e.keyCode === 13) {
            onSend();
          }
        }}
      />
      <Button onClick={onSend}>Send</Button>
      </Container>
      
    </Container>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);
