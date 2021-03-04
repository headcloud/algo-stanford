class Person:
  def __init__(self, name, birth, death):
    pass
 
def max_population_year(persons: List[Person]):
    years = [] # list [0..0] 2030 elements

    # [0..67] [1..23]
    for person in persons:
        years[person.birth] += 1
        years[person.death] -= 1
    # [100,1,1,-1,1]

    maxPeople = 0
    prev = 0
    answer = -1
    for index, value in enumerate(years):
        current = prev + value
        if current > maxPeople:
            maxPeople = current
            answer = index
        
        prev = current

    return answer

