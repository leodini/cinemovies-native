import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableHighlight,
  Modal
} from "react-native";
import axios from "axios";
import { TextInput } from "react-native-gesture-handler";

export default function App() {
  const apiurl = "http://omdbapi.com/?apikey=7a9a7ac9";
  const [state, setState] = useState({
    s: "enter a movie...",
    results: [],
    selected: {}
  });

  const search = () => {
    setState(prevState => {
      return { ...prevState, results: [] };
    });
    axios(`${apiurl}&s=${state.s}`).then(({ data }) => {
      let results = data.Search;
      setState(prevState => {
        return { ...prevState, results: results };
      });
    });
  };

  const openPopup = id => {
    axios(`${apiurl}&i=${id}`).then(({ data }) => {
      let result = data;
      console.log(result);
      setState(prevState => {
        return { ...prevState, selected: result };
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cinemovies</Text>
      <TextInput
        style={styles.searchbox}
        value={state.s}
        onChangeText={text =>
          setState(prevState => {
            return { ...prevState, s: text };
          })
        }
        onSubmitEditing={search}
      />
      <ScrollView style={styles.results}>
        {state.results.map(result => {
          return (
            <TouchableHighlight
              key={result.imdbID}
              onPress={() => openPopup(result.imdbID)}
            >
              <View style={styles.result}>
                <Image
                  source={{ uri: result.Poster }}
                  style={{
                    width: "100%",
                    height: 300
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.heading}>{result.Title}</Text>
              </View>
            </TouchableHighlight>
          );
        })}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={false}
        visible={typeof state.selected.Title !== "undefined" ? true : false}
      >
        <View style={styles.popup}>
          <Text style={styles.poptitle}>{state.selected.Title}</Text>
          <Text style={styles.rating}>Rating: {state.selected.imdbRating}</Text>
          <Text>{state.selected.Plot}</Text>
        </View>
        <TouchableHighlight
          onPress={() =>
            setState(prevState => {
              return { ...prevState, selected: {} };
            })
          }
        >
          <Text style={styles.closeBtn}>Close</Text>
        </TouchableHighlight>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d2e2d",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 70,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 40,
    fontFamily: "Roboto",
    color: "#fff"
  },
  searchbox: {
    fontSize: 20,
    fontWeight: "300",
    padding: 20,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 40
  },
  results: {
    flex: 1,
    width: "100%",
    marginBottom: 20
  },
  heading: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    padding: 20,
    backgroundColor: "#445565",
    marginBottom: 20
  },
  popup: {
    padding: 20
  },
  poptitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 5
  },
  closeBtn: {
    padding: 20,
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "#2484c4"
  }
});
